<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class program extends Model
{
    use HasFactory;


    protected $table = 'program';
    protected $primaryKey = 'program_id';
    protected $fillable = [
        'program_name',
        'program_type',
        'program_description',
        'degree_id',
        'status',
        'created_by',
        'updated_by',
        'program_criteria',
        'degree_id' => 'integer',
        'created_by' => 'integer',
        'updated_by' => 'integer',
        'program_criteria' => 'double',
    ];
}
