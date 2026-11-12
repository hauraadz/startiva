<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Menjalankan migration.
     */
    public function up()
    {
        Schema::create('counselor_profiles', function (Blueprint $table) {
            $table->id();

            // Relasi dengan akun konselor
            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            // Informasi profil konselor
            $table->string('student_id')->unique();
            $table->string('phone')->nullable();
            $table->text('bio')->nullable();
            $table->string('expertise')->nullable();

            // Status verifikasi atau keaktifan konselor
            $table->string('status')->default('active');

            $table->timestamps();
        });
    }

    /**
     * Membatalkan migration.
     */
    public function down()
    {
        Schema::dropIfExists('counselor_profiles');
    }
};
