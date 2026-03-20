<?php
$hash = '$2y$10$vY3vQ01v7Qwq.9SihG.Xf.Z0aN83x2GvwD1kK/u6H/f17n3Q5Y7/m';
if (password_verify('admin123', $hash)) {
    echo "Hash matches admin123\n";
} else {
    echo "Hash does NOT match! Generating new one: \n";
    echo password_hash('admin123', PASSWORD_BCRYPT);
}
?>
