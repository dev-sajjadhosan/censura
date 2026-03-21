import ejs from "ejs";
import fs from "fs";
import path from "path";

const TEMPLATE_DIR = path.join(process.cwd(), "src", "app", "templates");
const OUTPUT_DIR = path.join(process.cwd(), "email-previews");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

const renderAndSave = async (templateName: string, data: any) => {
  const templatePath = path.join(TEMPLATE_DIR, `${templateName}.ejs`);
  const html = await ejs.renderFile(templatePath, data);
  fs.writeFileSync(
    path.join(OUTPUT_DIR, `${templateName}.html`),
    html as string,
  );
  console.log(`Generated ${templateName}.html`);
};

const dummyData = {
  name: "John Doe",
  userName: "John Doe",
  otp: "948271",
  plan: "PREMIUM YEARLY",
  startDate: new Date().toLocaleDateString(),
  endDate: new Date(
    Date.now() + 365 * 24 * 60 * 60 * 1000,
  ).toLocaleDateString(),
  loginUrl: "http://localhost:3000/login",
  betterAuthUrl: "http://localhost:3000",
  callbackURL: "http://localhost:3000/callback",
};

const run = async () => {
  try {
    await renderAndSave("otp", dummyData);
    await renderAndSave("subscription-success", dummyData);
    await renderAndSave("subscription-halfway", dummyData);
    await renderAndSave("subscription-expired", dummyData);
    await renderAndSave("googleRedirect", dummyData);
    console.log(
      "All previews generated successfully in the /email-previews folder!",
    );
  } catch (e) {
    console.error(e);
  }
};

run();
