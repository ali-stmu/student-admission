<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class education extends Model
{
    use HasFactory;


    protected $table = 'education';
    protected $primaryKey = 'education_id';
    protected $fillable = [
        'student_id',
        'degree_id',
        'qualification',
        'institution_name',
        'institution_location',
        'graduation_date',
        'status',
        'created_by',
        'updated_by',
        'passing_year',
        'total_marks',
        'obtained_marks',
        'CGPA',
        'percentage_criteria',
        'result_status',
        'school_name',
        'school_country',
        'school_city',
    ];
}
