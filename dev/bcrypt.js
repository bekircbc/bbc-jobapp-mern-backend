import bcrypt from "bcrypt";

// CREATE SALT AND HASH WHEN USER CREATES PASSWORD
const salt = await bcrypt.genSalt();
console.log(`salt: ${salt}`);
const hash = await bcrypt.hash("password", salt);
console.log(`hash: ${hash}`);

// SAVE CREATED HASH IN THE DATABASE FOR THE USER
const hash1 = "$2b$10$7als6Vw2sOiqRyj22YdVfO0MCJ8R.8yc4bYYgHrncOXMRS8gdgNQC";
const hash2 = "$2b$10$DYtulkXrR3XyWiRoCTzRG.dn7d.gduklI8hocQpHraMi0NEQ0fgfG";
const hash3 = "$2b$10$CeLYT7jAguaiJZsEjAej.O0Fqh/rIGk6209whKjCee0RyPRKwzndy";

// WHEN USER LOGS IN, ASK BCRYPT IF THE HASH IN THE DATABASE WOULD COME FROM THIS PASSWORD
console.log(await bcrypt.compare("password", hash1));
console.log(await bcrypt.compare("password", hash2));
console.log(await bcrypt.compare("password", hash3));
