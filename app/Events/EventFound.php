<?php

namespace App\Events;

use App\Models\Event;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

class EventFound implements ShouldBroadcastNow
{
    public $event;

    public function __construct(Event $event)
    {
        $this->event = $event;
    }

    public function broadcastOn()
    {
        return new Channel('events');
    }

    public function broadcastWith()
    {
        return [
            'id' => $this->event->id,
            'title' => $this->event->title,
            'description' => $this->event->description,
            'date' => $this->event->date,
            'time' => $this->event->time,
        ];
    }
}
