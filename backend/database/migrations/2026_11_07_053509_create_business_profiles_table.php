
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('business_profiles', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->onDelete('cascade');

            $table->string('business_name')->nullable();
            $table->string('business_stage');
            $table->string('business_category')->nullable();
            $table->text('business_idea')->nullable();
            $table->text('product_description')->nullable();
            $table->string('target_market')->nullable();

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('business_profiles');
    }
};
