import bcrypt from 'bcryptjs';

export function hashPassword(password: string) : string {
    if (typeof password !== "string") {
        throw new Error("hashPassword expects a string");
    }
    if (password.length === 0) {
        throw new Error("hashPassword expects a non empty string");
    }

    // Use bcrypt (it stores salt within the string)
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
}

export function checkPassword(password: string, passwordHash: string) : boolean {
    const equal = bcrypt.compareSync(password, passwordHash);
    return equal;
}
