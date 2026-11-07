
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('business_assessments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->json('answers');
            $table->integer('total_score');
            $table->decimal('score_percentage', 5, 2);
            $table->string('readiness_level');

            $table->json('aspect_scores')->nullable();
            $table->json('recommendations')->nullable();

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('business_assessments');
    }
};
