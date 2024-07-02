<?php

use Illuminate\Support\Facades\Broadcast;


Broadcast::channel('events', fn () => true);
