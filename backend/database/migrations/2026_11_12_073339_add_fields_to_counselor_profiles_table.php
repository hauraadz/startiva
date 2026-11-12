
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Menambahkan kolom profil konselor.
     */
    public function up()
    {
        Schema::table('counselor_profiles', function (Blueprint $table) {
            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->cascadeOnDelete();

            $table->string('student_id')->nullable()->unique();
            $table->string('phone')->nullable();
            $table->text('bio')->nullable();
            $table->string('expertise')->nullable();
            $table->string('status')->default('active');
        });
    }

    /**
     * Menghapus kolom tambahan.
     */
    public function down()
    {
        Schema::table('counselor_profiles', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropUnique(['student_id']);

            $table->dropColumn([
                'user_id',
                'student_id',
                'phone',
                'bio',
                'expertise',
                'status',
            ]);
        });
    }
};
