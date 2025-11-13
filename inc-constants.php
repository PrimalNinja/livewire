<?php

$MODULES = ['livewire', 'security', 'system'];

define('ALLOW_GET', false);
define('DIR_MODULES', './modules/');
define('DIR_SESSIONS', './sessions/');
define('LOG_ERROR', './logs/error.log');

define('DB_ENABLED', false);
define('DB_SESSIONS', false);
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', 'root');
define('DB_NAME', 'qri');

define('RESPONSE_NOERROR', 0);
define('RESPONSE_ERROR', 1);
