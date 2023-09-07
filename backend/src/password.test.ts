import { checkPassword, hashPassword } from "./password";

describe('Password tests', () => {
    const testPassword = (password: string) => {
        test('Hash and check: ' + password, () => {
            const hash = hashPassword(password);
            const equal = checkPassword(password, hash);
            expect(equal).toEqual(true);
        });
    }

    testPassword("password");
    testPassword("12345");
    testPassword("ÖÄ#Å#%ß=)(/\"");
    testPassword("This is a really long password!!!!");
    testPassword("This is a really really really really really really really really really really really really really really really really really really really really really long password!!!!");
    testPassword("1");
    
    test('Non string fails', () => {
        const func = () => {
            const hash = hashPassword(234 as any);
        }
        expect(func).toThrowError("hashPassword expects a string");
    });

    test('Empty string fails', () => {
        const func = () => {
            const hash = hashPassword("");
        }
        expect(func).toThrowError("hashPassword expects a non empty string");
    });
});
    