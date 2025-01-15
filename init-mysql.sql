CREATE TABLE IF NOT EXISTS `Transaction` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,  -- Automatically adds a unique ID column
    `userId` INT NOT NULL,               -- userId as an integer, cannot be null
    `amount` DECIMAL(10, 2) NOT NULL,    -- amount as DECIMAL with precision (10, 2), cannot be null
    `status` VARCHAR(255) NOT NULL DEFAULT 'pending', -- status as a string with a default value of 'pending'
    `transactionId` VARCHAR(255) NOT NULL UNIQUE, -- transactionId as a unique string, cannot be null
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Automatically sets the timestamp for creation
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Automatically updates the timestamp on updates
);
