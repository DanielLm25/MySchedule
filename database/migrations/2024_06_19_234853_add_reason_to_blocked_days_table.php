<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddReasonToBlockedDaysTable extends Migration
{
    public function up()
    {
        Schema::table('blocked_days', function (Blueprint $table) {
            $table->text('reason')->nullable()->after('end_date');
        });
    }

    public function down()
    {
        Schema::table('blocked_days', function (Blueprint $table) {
            $table->dropColumn('reason');
        });
    }
}
