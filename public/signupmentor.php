<?php

$first_name = $_POST['first_name'];
$second_name = $_POST['second_name'];
$email = $_POST['email'];
$password = $_POST['password'];
$confirm_password = $_POST['confirm_password'];
$phone = $_POST['phone'];
$college = $_POST['college'];
$branch = $_POST['branch'];
$cgpa = $_POST['cgpa'];
$graduation_year = $_POST['graduation_year'];

if (!empty($first_name) && !empty($second_name) && !empty($email) && !empty($password) && !empty($confirm_password) && !empty($phone) && !empty($college) && !empty($branch) && !empty($cgpa) && !empty($graduation_year)) {

    $host = "mysql.hostinger.com"; 
    $dbUsername = "u607283890_leadinglight";
    $dbPassword = "Aashif@123";
    $dbname = "mentor_register";

    $conn = new mysqli($host, $dbUsername, $dbPassword, $dbname);

    if ($conn->connect_error){
        die('Connect Error('.$conn->connect_errno.') '.$conn->connect_error);
    } else {
        $SELECT = "SELECT email FROM register WHERE email = ? LIMIT 1";
        $INSERT = "INSERT INTO register (first_name, second_name, email, password, confirm_password, phone, college, branch, cgpa, graduation_year) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        $stmt = $conn->prepare($SELECT);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows == 0) {
            $stmt->close();

            $stmt = $conn->prepare($INSERT);
            $stmt->bind_param("ssssssssss", $first_name, $second_name, $email, $password, $confirm_password, $phone, $college, $branch, $cgpa, $graduation_year);
            $stmt->execute();
            echo "New record inserted successfully.";
        } else {
            echo "Someone already registered using this email.";
        }

        $stmt->close();
        $conn->close();
    }

} else {
    echo "All fields are required.";
    die();
}
?>