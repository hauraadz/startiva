
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

            // Mahasiswa yang mengajukan konseling
            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            // Konselor yang menangani pengajuan
            $table->foreignId('counselor_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->string('topic');
            $table->text('description');

            $table->string('preferred_contact', 100)->nullable();
            $table->string('contact_detail')->nullable();

            // pending, accepted, rejected, completed
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
