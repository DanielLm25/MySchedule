<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index()
    {
        $events = Event::all();
        return response()->json($events);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date' => 'required|date',
            'time' => 'required|date_format:H:i',
            'color' => 'nullable|string|max:7',
            'recurrence' => 'nullable|string',
            'days_of_week' => 'nullable|array', // Validação para days_of_week
            'days_of_week.*' => 'integer|min:0|max:6', // Validação para cada dia da semana
        ]);

        $validated['days_of_week'] = $validated['days_of_week'] ?? [];

        $event = Event::create($validated);

        return redirect()->route('events.index')->with('success', 'Event created successfully.');
    }

    public function show(Event $event)
    {
        return response()->json($event);
    }

    public function update(Request $request, Event $event)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date' => 'required|date_format:Y-m-d',
            'time' => 'required|date_format:H:i',
            'color' => 'nullable|string|max:7',
            'recurrence' => 'nullable|string',
            'days_of_week' => 'nullable|array', // Validação para days_of_week
            'days_of_week.*' => 'integer|min:0|max:6', // Validação para cada dia da semana
        ]);

        $validatedData['days_of_week'] = $validatedData['days_of_week'] ?? [];

        $event->update($validatedData);

        return response()->json($event);
    }

    public function destroy(Event $event)
    {
        $event->delete();
        return response()->noContent();
    }
}
