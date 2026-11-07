
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('consultations', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->onDelete('cascade');

            $table->foreignId('business_profile_id')
                ->nullable()
                ->constrained('business_profiles')
                ->nullOnDelete();

            $table->string('topic');
            $table->text('description');
            $table->string('preferred_contact')->nullable();
            $table->string('contact_detail')->nullable();
            $table->string('status')->default('pending');
            $table->text('consultation_notes')->nullable();

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('consultations');
    }
};
