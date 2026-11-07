
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('assessments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->onDelete('cascade');

            $table->foreignId('business_profile_id')
                ->nullable()
                ->constrained('business_profiles')
                ->nullOnDelete();

            $table->integer('total_score')->nullable();
            $table->string('readiness_level')->nullable();
            $table->string('status')->default('in_progress');
            $table->timestamp('completed_at')->nullable();

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('assessments');
    }
};
