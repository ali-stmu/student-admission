<!DOCTYPE html>
<html>

<head>
    <title>Applicant Data</title>
</head>

<body>
    <h1>Applicant Data</h1>
    @foreach ($applicantsData as $applicant)
        <p>Name: {{ $applicant['student_information']['first_name'] }}
            {{ $applicant['student_information']['last_name'] }}</p>
        <p>Father's Name: {{ $applicant['student_information']['father_name'] }}</p>
        <p>Phone Number: {{ $applicant['student_information']['phone_number'] }}</p>
        <p>Student ID: {{ $applicant['student_information']['student_id'] }}</p>
        <p>Intermediate Percentage: {{ $applicant['intermediate_percentage']['percentage_criteria'] }}</p>
        <p>Test Score Percentage: {{ $applicant['test_score_percentage']['percentage'] }}</p>
        <p>Voucher File Path: {{ $applicant['voucher_full_path'] }}</p>
        <p>File Name: {{ $applicant['file_name'] }}</p>
        <p>Program ID: {{ $applicant['program_id'] }}</p>
        <p>Date: {{ $applicant['date'] }}</p>
        <p>Voucher ID: {{ $applicant['voucherId'] }}</p>
        <p>CNIC: {{ $applicant['cnic']['cnic'] }}</p>
        <!-- Add more fields as needed -->
        <br>
    @endforeach
</body>

</html>
