<?php

namespace App\Listeners;

use App\Events\EventFound;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class ProcessEventFound
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param EventFound $event
     * @return void
     */
    public function handle(EventFound $event)
    {
        // Exemplo: Log para registrar o evento encontrado
        $eventTitle = $event->event->title;
        Log::info("Evento encontrado: {$eventTitle}");

        // Exemplo: Notificação para usuários sobre o evento encontrado
        // Notificação usando Laravel Notification:
        // \Notification::send($event->event->users, new EventFoundNotification($event->event));
    }
}
