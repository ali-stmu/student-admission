<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    protected $table = 'application';
    protected $primaryKey = 'application_id';
    public $timestamps = true; // If you want to use timestamps (created_at and updated_at)

    // Define fillable columns
    protected $fillable = [
        'student_id',
        'program_id_1',
        'program_id_2',
        'program_id_3',
        'program_id_4',
        'application_status',
        'application_date',
        'decision_date',
        'form_state',
        'status',
        'created_by',
        'updated_by',
        'session_id_1',
        'session_id_2',
        'session_id_3',
        'session_id_4',

    ];
}
