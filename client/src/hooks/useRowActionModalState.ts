"use client";

import { useState, useCallback } from "react";

export const useRowActionModalState = <TItem,>() => {
  const [viewingItem, setViewingItem] = useState<TItem | null>(null);
  const [editingItem, setEditingItem] = useState<TItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<TItem | null>(null);

  const isViewDialogOpen = !!viewingItem;
  const isEditModalOpen = !!editingItem;
  const isDeleteDialogOpen = !!deletingItem;

  const onViewOpenChange = useCallback((open: boolean) => {
    if (!open) setViewingItem(null);
  }, []);

  const onEditOpenChange = useCallback((open: boolean) => {
    if (!open) setEditingItem(null);
  }, []);

  const onDeleteOpenChange = useCallback((open: boolean) => {
    if (!open) setDeletingItem(null);
  }, []);

  const tableActions = {
    onView: (data: TItem) => setViewingItem(data),
    onEdit: (data: TItem) => setEditingItem(data),
    onDelete: (data: TItem) => setDeletingItem(data),
  };

  return {
    viewingItem,
    editingItem,
    deletingItem,
    isViewDialogOpen,
    isEditModalOpen,
    isDeleteDialogOpen,
    onViewOpenChange,
    onEditOpenChange,
    onDeleteOpenChange,
    tableActions,
  };
};
