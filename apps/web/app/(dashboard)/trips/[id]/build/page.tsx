"use client";

import React, { use, useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useItineraryStore } from "@/lib/itinerary/store";
import { DayColumn } from "@/components/itinerary/DayColumn";
import { ActivityCard } from "@/components/itinerary/ActivityCard";
import type { StopActivity } from "@/lib/itinerary/types";
import { ActivityDrawer } from "@/components/itinerary/ActivityDrawer";
import dynamic from 'next/dynamic';

const DynamicMapPanel = dynamic(() => import("@/components/itinerary/MapPanel").then(mod => mod.MapPanel), {
  ssr: false,
});

interface TripBuildPageProps {
  params: Promise<{ id: string }>;
}

export default function TripBuildPage({ params }: TripBuildPageProps) {
  const resolvedParams = use(params);
  const tripId = resolvedParams.id;

  const getDaySchedules = useItineraryStore((s) => s.getDaySchedules);
  const moveActivity = useItineraryStore((s) => s.moveActivity);
  const reorderDayActivities = useItineraryStore((s) => s.reorderDayActivities);
  const removeActivity = useItineraryStore((s) => s.removeActivity);
  const addActivity = useItineraryStore((s) => s.addActivity);
  const updateActivity = useItineraryStore((s) => s.updateActivity);

  const daySchedules = getDaySchedules(tripId);

  const [activeActivity, setActiveActivity] = useState<StopActivity | null>(null);
  
  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<StopActivity | undefined>();
  const [selectedDateForNew, setSelectedDateForNew] = useState<string>("");

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

  if (!daySchedules || daySchedules.length === 0) {
    return <div className="p-8">Loading or no days found...</div>;
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    let draggedSa: StopActivity | null = null;
    
    // Find the dragged activity
    for (const day of daySchedules) {
      const found = day.activities.find((a) => a.id === active.id);
      if (found) {
        draggedSa = found;
        break;
      }
    }
    setActiveActivity(draggedSa);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveActivity(null);
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find source container (date) and indices
    let sourceDate = "";
    let destDate = "";
    
    // Determine destination date
    if (daySchedules.some(d => d.date === overId)) {
      destDate = overId; // Dropped directly onto a column
    } else {
      // Dropped onto an item, find its column
      for (const day of daySchedules) {
        if (day.activities.some(a => a.id === overId)) {
          destDate = day.date;
          break;
        }
      }
    }

    // Determine source date
    for (const day of daySchedules) {
      if (day.activities.some(a => a.id === activeId)) {
        sourceDate = day.date;
        break;
      }
    }

    if (!sourceDate || !destDate) return;

    if (sourceDate === destDate) {
      // Reordering in same column
      if (activeId !== overId) {
        const dayActs = daySchedules.find(d => d.date === sourceDate)?.activities || [];
        const oldIndex = dayActs.findIndex(a => a.id === activeId);
        const newIndex = dayActs.findIndex(a => a.id === overId);
        reorderDayActivities({ tripId, date: sourceDate, oldIndex, newIndex });
      }
    } else {
      // Moving to different column
      let beforeId: string | null = null;
      if (overId !== destDate) {
        // Dropped onto an item in the destination column
        beforeId = overId;
      }
      moveActivity({ activityId: activeId, toDate: destDate, beforeId });
    }
  };

  const handleAddActivity = (date: string) => {
    setSelectedDateForNew(date);
    setEditingActivity(undefined);
    setDrawerOpen(true);
  };

  const handleEditActivity = (sa: StopActivity) => {
    setEditingActivity(sa);
    setSelectedDateForNew(sa.scheduledDate);
    setDrawerOpen(true);
  };

  const handleSaveActivity = (data: Partial<StopActivity["activity"]> & { scheduledTime?: string }) => {
    if (editingActivity) {
      updateActivity({
        tripId,
        activityId: editingActivity.id,
        name: data.name,
        category: data.category,
        scheduledTime: data.scheduledTime,
        durationMinutes: data.durationMinutes,
        costEstimate: data.costEstimate,
      });
    } else {
      // Create new
      const newSa: StopActivity = {
        id: `act-${Date.now()}`,
        stopId: `stop-${tripId}`, // Mock stopId since the store falls back to the first stop if missing
        activityId: `db-act-${Date.now()}`,
        scheduledDate: selectedDateForNew,
        scheduledTime: data.scheduledTime || "09:00",
        activity: {
          id: `db-act-${Date.now()}`,
          name: data.name || "New Activity",
          category: data.category || "sightseeing",
          durationMinutes: data.durationMinutes || 60,
          costEstimate: data.costEstimate || 0,
          description: "",
          cityId: `city-${tripId}`
        }
      };
      addActivity({ tripId, newSa });
    }
  };

  const handleRemoveActivity = (id: string) => {
    removeActivity({ tripId, activityId: id });
  };

  // Extract all activities across all days for the map
  const allScheduledActivities = daySchedules.flatMap(d => d.activities);
  const trip = useItineraryStore((s) => s.getTrip(tripId));
  const firstCity = trip?.stops?.[0]?.city;

  return (
    <div className="flex-1 w-full overflow-hidden flex flex-col md:flex-row pt-6 pb-20">
      
      {/* MAP PANEL - Hide on mobile, show on tablet+ */}
      <div className="hidden md:block w-[350px] lg:w-[450px] p-4 pt-0 h-[calc(100vh-180px)]">
        <DynamicMapPanel 
          activities={allScheduledActivities} 
          centerLat={firstCity?.lat || 51.505}
          centerLng={firstCity?.lng || -0.09}
        />
      </div>

      {/* DND COLUMNS */}
      <div className="flex-1 w-full overflow-x-auto custom-scrollbar h-[calc(100vh-180px)]">
        <div className="flex gap-4 px-6 md:px-8 pb-8 min-w-max h-full">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {daySchedules.map((day, idx) => (
              <DayColumn
                key={day.date}
                date={day.date}
                dayLabel={day.dayLabel}
                activities={day.activities}
                colIndex={idx}
                onAddActivity={handleAddActivity}
                onRemoveActivity={handleRemoveActivity}
                onEditActivity={handleEditActivity}
              />
            ))}

            <DragOverlay dropAnimation={{ duration: 200, easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)" }}>
              {activeActivity ? (
                <div className="w-[246px] rotate-3 opacity-90 shadow-2xl scale-105 transition-transform">
                  <ActivityCard stopActivity={activeActivity} variant="board" />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>

      <ActivityDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        date={selectedDateForNew}
        dayLabel={daySchedules.find(d => d.date === selectedDateForNew)?.dayLabel || selectedDateForNew}
        initialActivity={editingActivity}
        onAdd={handleSaveActivity}
        onEdit={(data) => {
          if (editingActivity) {
            updateActivity({
              tripId,
              activityId: editingActivity.id,
              ...data
            });
          }
        }}
      />
    </div>
  );
}
