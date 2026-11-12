
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        if (!Schema::hasColumn('consultations', 'counselor_id')) {
            Schema::table('consultations', function (Blueprint $table) {
                $table->foreignId('counselor_id')
                    ->nullable()
                    ->constrained('users')
                    ->nullOnDelete();
            });
        }
    }

    public function down()
    {
        if (Schema::hasColumn('consultations', 'counselor_id')) {
            Schema::table('consultations', function (Blueprint $table) {
                $table->dropColumn('counselor_id');
            });
        }
    }
};
