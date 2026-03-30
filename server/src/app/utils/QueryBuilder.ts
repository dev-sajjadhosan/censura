/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IQueryConfig,
  IQueryParams,
  IQueryResult,
  PrismaCountArgs,
  PrismaFindManyArgs,
  PrismaModelDelegate,
  PrismaWhereConditions,
} from "../interfaces/query.interface";

export class QueryBuilder<
  T,
  TWhereInput = Record<string, unknown>,
  TInclude = Record<string, unknown>,
> {
  private query: PrismaFindManyArgs;
  private countQuery: PrismaCountArgs;
  private page: number = 1;
  private limit: number = 10;
  private skip: number = 0;
  private sortBy: string = "createdAt";
  private sortOrder: "asc" | "desc" = "desc";
  private selectFields: Record<string, boolean> | undefined;

  constructor(
    private model: PrismaModelDelegate,
    private queryParams: IQueryParams,
    private config: IQueryConfig = {},
  ) {

    this.queryParams = queryParams || {}

    this.query = {
      where: {},
      include: {},
      orderBy: {},
      skip: 0,
      take: 10,
    };

    this.countQuery = {
      where: {},
    };
  }

  search(): this {
    const { search } = this.queryParams;
    const { searchableFields } = this.config;

    if (search && searchableFields && searchableFields.length > 0) {
      const searchConditions: Record<string, unknown>[] = searchableFields.map(
        (field) => {
          const stringFilter = {
            contains: search,
            mode: "insensitive" as const,
          };

          if (field.includes(".")) {
            const parts = field.split(".");
            if (parts.length === 2) {
              const [relation, nestedField] = parts;
              return { [relation]: { [nestedField]: stringFilter } };
            } else if (parts.length === 3) {
              const [relation, nestedRelation, nestedField] = parts;
              return {
                [relation]: {
                  some: { [nestedRelation]: { [nestedField]: stringFilter } },
                },
              };
            }
          }
          return { [field]: stringFilter };
        },
      );

      (this.query.where as PrismaWhereConditions).OR = searchConditions;
      (this.countQuery.where as PrismaWhereConditions).OR = searchConditions;
    }
    return this;
  }

  filter(): this {
    const { filterableFields } = this.config;
    const excludedFields = [
      "search",
      "page",
      "limit",
      "sortBy",
      "sortOrder",
      "fields",
      "include",
    ];

    Object.keys(this.queryParams).forEach((key) => {
      const value = this.queryParams[key];
      if (value === undefined || value === "" || excludedFields.includes(key))
        return;

      const isAllowed =
        !filterableFields ||
        filterableFields.length === 0 ||
        filterableFields.includes(key);
      if (!isAllowed) return;

      const queryWhere = this.query.where as Record<string, any>;
      const countWhere = this.countQuery.where as Record<string, any>;

      if (key.includes(".")) {
        const parts = key.split(".");
        if (parts.length === 2) {
          const [rel, field] = parts;
          queryWhere[rel] = {
            ...queryWhere[rel],
            [field]: this.parseFilterValue(value),
          };
          countWhere[rel] = {
            ...countWhere[rel],
            [field]: this.parseFilterValue(value),
          };
        } else if (parts.length === 3) {
          const [rel, nRel, field] = parts;
          const nestedCondition = {
            some: { [nRel]: { [field]: this.parseFilterValue(value) } },
          };
          queryWhere[rel] = this.deepMerge(
            queryWhere[rel] || {},
            nestedCondition,
          );
          countWhere[rel] = this.deepMerge(
            countWhere[rel] || {},
            nestedCondition,
          );
        }
      } else {
        const parsedValue =
          typeof value === "object" && !Array.isArray(value)
            ? this.parseRangeFilter(value)
            : this.parseFilterValue(value);

        queryWhere[key] = parsedValue;
        countWhere[key] = parsedValue;
      }
    });
    return this;
  }

  paginate(): this {
    const page = Number(this.queryParams.page) || 1;
    const limit = Number(this.queryParams.limit) || 10;
    this.page = page;
    this.limit = limit;
    this.skip = (page - 1) * limit;
    this.query.skip = this.skip;
    this.query.take = this.limit;
    return this;
  }

  sort(): this {
  let sortBy = this.queryParams.sortBy || "createdAt";
  const sortOrder = this.queryParams.sortOrder === "asc" ? "asc" : "desc";

  // 1. Map user-friendly names to actual Schema fields
  const sortMapping: Record<string, any> = {
    rating: { avgRating: sortOrder },
    likes: { likes: { _count: sortOrder } }, // Sorts by number of likes
    recent: { createdAt: sortOrder },
  };

  if (sortMapping[sortBy]) {
    this.query.orderBy = sortMapping[sortBy];
  } else if (sortBy.includes(".")) {
    const parts = sortBy.split(".");
    if (parts.length === 2) {
      this.query.orderBy = { [parts[0]]: { [parts[1]]: sortOrder } };
    }
  } else {
    this.query.orderBy = { [sortBy]: sortOrder };
  }

  return this;
}

  fields(defaultFields?: string[]): this {
    const fieldsParam = this.queryParams.fields;
    const fieldsToUse = fieldsParam
      ? fieldsParam.split(",").map((f) => f.trim())
      : defaultFields;

    if (fieldsToUse && fieldsToUse.length > 0) {
      this.selectFields = {};
      fieldsToUse.forEach((f) => (this.selectFields![f] = true));
      this.query.select = this.selectFields;
      delete this.query.include;
    }
    return this;
  }

  include(relation: TInclude): this {
    if (this.selectFields || this.query.select) return this;
    this.query.include = this.deepMerge(
      this.query.include || {},
      relation as any,
    );
    return this;
  }

  dynamicInclude(
    includeConfig: Record<string, any>,
    defaultInclude?: string[],
  ): this {
    if (this.selectFields || this.query.select) return this;
    const result: Record<string, any> = {};

    defaultInclude?.forEach((f) => {
      if (includeConfig[f]) result[f] = includeConfig[f];
    });

    const includeParam = this.queryParams.include;
    if (typeof includeParam === "string") {
      includeParam.split(",").forEach((r) => {
        const rel = r.trim();
        if (includeConfig[rel]) result[rel] = includeConfig[rel];
      });
    }

    this.query.include = this.deepMerge(this.query.include || {}, result);
    return this;
  }

  where(condition: TWhereInput): this {
    this.query.where = this.deepMerge(this.query.where || {}, condition as any);
    this.countQuery.where = this.deepMerge(
      this.countQuery.where || {},
      condition as any,
    );
    return this;
  }

  async execute(): Promise<IQueryResult<T>> {
    const [total, data] = await Promise.all([
      this.model.count(this.countQuery as any),
      this.model.findMany(this.query as any),
    ]);

    return {
      data: data as T[],
      meta: {
        page: this.page,
        limit: this.limit,
        total,
        totalPages: Math.ceil(total / this.limit),
      },
    };
  }

  private deepMerge(target: any, source: any): any {
    const result = { ...target };
    for (const key in source) {
      if (
        source[key] &&
        typeof source[key] === "object" &&
        !Array.isArray(source[key])
      ) {
        result[key] = this.deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }

  private parseFilterValue(value: any): any {
    if (value === "true") return true;
    if (value === "false") return false;
    if (typeof value === "string" && !isNaN(Number(value)) && value !== "")
      return Number(value);
    if (Array.isArray(value))
      return { in: value.map((v) => this.parseFilterValue(v)) };
    return value;
  }

  private parseRangeFilter(value: Record<string, any>): any {
    const range: any = {};
    const operators = [
      "lt",
      "lte",
      "gt",
      "gte",
      "equals",
      "not",
      "contains",
      "in",
      "notIn",
    ];
    Object.keys(value).forEach((op) => {
      if (operators.includes(op)) range[op] = this.parseFilterValue(value[op]);
    });
    return range;
  }
}
