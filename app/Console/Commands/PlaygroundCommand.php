<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Redis;

class PlaygroundCommand extends Command
{
    protected $signature = 'app:PlaygroundCommand';

    protected $description = 'Command description';

    public function handle()
    {
        Redis::incr('event_count'); // Incrementa o contador no Redis
        $this->info('Event count incremented successfully.');
    }
}
