
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('assessment_statistics', function (Blueprint $table) {
            $table->id();

            $table->unsignedInteger('total_assessments')->default(0);
            $table->unsignedInteger('total_responses')->default(0);

            $table->decimal('mean', 10, 2)->default(0);
            $table->decimal('standard_deviation', 10, 2)->default(0);

            $table->json('frequency')->nullable();

            $table->decimal('average_score_percentage', 5, 2)->default(0);

            $table->timestamp('calculated_at')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('assessment_statistics');
    }
};
