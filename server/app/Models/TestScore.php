<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TestScore extends Model
{
    protected $table = 'test_score';
    protected $primaryKey = 'test_score_id';
    protected $fillable = [
        'student_id',
        'test_score',
        'test_score_total',
        'test_date',
        'status',
        'test_name',
        'skip_test',
        'attachment_url',
        'percentage',
        'bio_total',
        'bio_obtained',
        'chem_total',
        'chem_obtained',
        'phy_total',
        'phy_total',
        'test_city',
        'test_reg_no',
    ];


}
