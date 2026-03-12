"use client";

import { useState, useRef, useCallback } from "react";

export function useDragReorder<T>(initialItems: T[]) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const dragItem = useRef<number | null>(null);

  const handleDragStart = useCallback((index: number) => {
    dragItem.current = index;
    setDragIndex(index);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragItem.current === null || dragItem.current === index) return;
    setOverIndex(index);

    setItems((prev) => {
      const newItems = [...prev];
      const dragged = newItems[dragItem.current!];
      newItems.splice(dragItem.current!, 1);
      newItems.splice(index, 0, dragged);
      dragItem.current = index;
      return newItems;
    });
    setHasChanges(true);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragIndex(null);
    setOverIndex(null);
    dragItem.current = null;
  }, []);

  const resetChanges = useCallback(() => {
    setHasChanges(false);
  }, []);

  const resetItems = useCallback((newItems: T[]) => {
    setItems(newItems);
    setHasChanges(false);
  }, []);

  return {
    items,
    dragIndex,
    overIndex,
    hasChanges,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    resetChanges,
    resetItems,
  };
}
