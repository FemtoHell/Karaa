import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Simple sortable item component
function SortableItem({ id, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: '16px',
    margin: '8px 0',
    background: isDragging ? '#e0e7ff' : '#f9fafb',
    border: '2px solid ' + (isDragging ? '#4f46e5' : '#e5e7eb'),
    borderRadius: '8px',
    cursor: 'grab',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div style={{ fontSize: '20px', color: '#9ca3af' }}>
        ⋮⋮
      </div>
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
}

// Main test component
export default function DragTest() {
  const [items, setItems] = useState([
    { id: '1', text: 'Item 1 - Click and drag me!' },
    { id: '2', text: 'Item 2 - Drag me up!' },
    { id: '3', text: 'Item 3 - Drag me down!' },
    { id: '4', text: 'Item 4 - I can be reordered!' },
    { id: '5', text: 'Item 5 - Try dragging!' },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        console.log('Items reordered:', newItems);
        return newItems;
      });
    }
  }

  return (
    <div style={{
      maxWidth: '600px',
      margin: '50px auto',
      padding: '24px',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ marginBottom: '24px', color: '#111827' }}>
        🎯 Drag & Drop Test
      </h1>
      <p style={{ marginBottom: '24px', color: '#6b7280' }}>
        Click and hold on any item, then drag to reorder. Open the browser console to see logs.
      </p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map(item => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((item) => (
            <SortableItem key={item.id} id={item.id}>
              <strong>{item.text}</strong>
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>

      <div style={{
        marginTop: '24px',
        padding: '16px',
        background: '#f0fdf4',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#166534'
      }}>
        <strong>✅ If drag works here:</strong> The library is working correctly.
        The issue might be with the Editor component integration.
      </div>

      <div style={{
        marginTop: '12px',
        padding: '16px',
        background: '#fef2f2',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#991b1b'
      }}>
        <strong>❌ If drag doesn't work here:</strong> There might be a library installation issue.
        Try: <code>npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities</code>
      </div>
    </div>
  );
}
