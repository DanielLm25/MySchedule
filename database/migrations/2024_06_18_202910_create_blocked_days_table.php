<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBlockedDaysTable extends Migration
{
    public function up()
    {
        Schema::create('blocked_days', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); // Chave estrangeira para o ID do usuário
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->enum('type', ['range', 'specific', 'recurring']);
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->json('specific_dates')->nullable();
            $table->json('recurring_days')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('blocked_days');
    }
}
