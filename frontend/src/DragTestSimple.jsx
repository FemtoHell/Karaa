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
} from '@dnd-kit/sortable';
import SimpleSortableItem from './components/SimpleSortableItem';

/**
 * SIMPLE DRAG TEST - Verify drag & drop works
 */
const DragTestSimple = () => {
  const [items, setItems] = useState([
    { id: 1, name: 'Item 1', description: 'Click icon to drag' },
    { id: 2, name: 'Item 2', description: 'Click text to edit' },
    { id: 3, name: 'Item 3', description: 'Drag works perfectly' },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 0,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const updateItem = (id, field, value) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🧪 Drag & Drop Test</h1>
      <p style={{ marginBottom: '20px', color: '#666' }}>
        <strong>Instructions:</strong><br/>
        1. Click the <strong>⋮⋮ icon</strong> on the left to drag<br/>
        2. Click the <strong>text</strong> to edit<br/>
        3. Both should work without conflict
      </p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map(i => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map(item => (
            <SimpleSortableItem key={item.id} id={item.id}>
              <div>
                <div
                  contentEditable
                  suppressContentEditableWarning
                  style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                    outline: 'none',
                    border: '1px solid transparent',
                    padding: '4px',
                    borderRadius: '4px',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
                  onBlur={(e) => {
                    updateItem(item.id, 'name', e.target.textContent);
                    e.target.style.borderColor = 'transparent';
                  }}
                >
                  {item.name}
                </div>
                <div
                  contentEditable
                  suppressContentEditableWarning
                  style={{
                    fontSize: '14px',
                    color: '#666',
                    outline: 'none',
                    border: '1px solid transparent',
                    padding: '4px',
                    borderRadius: '4px',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
                  onBlur={(e) => {
                    updateItem(item.id, 'description', e.target.textContent);
                    e.target.style.borderColor = 'transparent';
                  }}
                >
                  {item.description}
                </div>
              </div>
            </SimpleSortableItem>
          ))}
        </SortableContext>
      </DndContext>

      <div style={{ marginTop: '40px', padding: '20px', background: '#f0f0f0', borderRadius: '8px' }}>
        <h3>Current Order:</h3>
        <pre>{JSON.stringify(items.map(i => ({ id: i.id, name: i.name })), null, 2)}</pre>
      </div>
    </div>
  );
};

export default DragTestSimple;
