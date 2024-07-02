<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use Carbon\Carbon;
use App\Models\Event;
use App\Events\EventFound;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Event as EventFacade;

Artisan::command('current:time', function () {
    $localDateTime = Carbon::now();
    $this->info('A data e hora local atual é: ' . $localDateTime->toDateTimeString());
})->purpose('Obter a data e hora local atual');


Artisan::command('events:check', function () {
    $events = Event::whereDate('date', now()->toDateString())
        ->whereTime('time', now()->toTimeString())
        ->get();

    if ($events->isEmpty()) {
        $this->info('Nenhum evento encontrado.');
    } else {
        $this->info('Eventos encontrados:');
        foreach ($events as $event) {
            $this->line("Evento ID: {$event->id} - {$event->title}");
            Log::info('Disparando evento para o evento ID: ' . $event->id);
            EventFacade::dispatch(new EventFound($event)); // Emitir o evento para o Echo
        }
    }
})->purpose('Verificar eventos e emitir para o frontend');



Schedule::command('events:check')
    ->everyMinute()
    ->appendOutputTo('/home/daniel/dev/SCHEDULE/storage/logs/laravel.log')
    ->description('Verificar eventos e emitir para o frontend');
