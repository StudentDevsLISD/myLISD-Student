
describe('LISD STUDENT', () => {
    beforeAll(()=>{
        jest.mock('@react-native-async-storage/async-storage', () => ({
            getItem: jest.fn(() => Promise.resolve(null)),
            setItem: jest.fn(() => Promise.resolve(null)),
        }));
    } );

    test("if study bdd", () => {
        //writeme
    })
})