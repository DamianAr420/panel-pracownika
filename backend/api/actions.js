const User = require('../db/model');
const bcrypt = require('bcrypt');

class Actions {

    async login(req, res) {
        const { login, password } = req.body; 
        try {
            const user = await User.findOne({ login: login });
            if(!user) {
                console.log("Podany login nie istnieje");
                return res.status(401).json({ error: "Podany login nie istnieje" });
            }
            if(!user.password) {
                console.log("Użytkownik nie ma przypisanego hasła");
                return res.status(401).json({ error: "Użytkownik nie ma przypisanego hasła" });
            }
            const passwordMatch = await bcrypt.compare(password, user.password);
            if(passwordMatch) {
                console.log("Zalogowano");
                return res.status(200).json({ user }); 
            } else {
                console.log("Nieprawidłowe hasło");
                return res.status(401).json({ error: 'Nieprawidłowe hasło' });
            }
        } catch(err) {
            console.log("Błąd podczas logowania:", err);
            return res.status(500).json({ error: 'Błąd podczas logowania' });
        }
    }

    async fetchData(req, res) {
        try {
            const users = await User.find();
            return res.status(200).json({ users });
        } catch(err) {
            console.log("Błąd podczas pobierania listy", err);
            return res.status(500).json({error: 'Błąd podczas pobierania listy'});
        }
    }

    async edit(req, res) {
        const { _id, Tel, Email, Login, Hasło } = req.body;
        let editedUser;
        try {
            if(Hasło !== "") {
                const hashedPassword = await bcrypt.hash(Hasło, 12);
                editedUser = await User.updateOne({ _id: _id }, { tel: Tel, email: Email, login: Login, password: hashedPassword });
            } else {
                editedUser = await User.updateOne({ _id: _id }, { tel: Tel, email: Email, login: Login });
            }

            if(editedUser.modifiedCount === 1) {
                res.status(200).json({ message: 'Dane użytkownika zostały zaktualizowane' });
            } else {
                res.status(404).json({ message: 'Nie znaleziono użytkownika do aktualizacji' });
            }
        } catch (err) {
            console.error('Błąd podczas aktualizacji danych użytkownika:', err);
            res.status(500).json({ message: 'Błąd podczas aktualizacji danych użytkownika' });
        }
    }

    async addShifts(req, res) {
        const { shifts } = req.body;

        try {
            for(const shift of shifts) {
                const user = await User.findById(shift.user);
                if(user) {
                    const existingShift = user.zmiany.find(zmiana => zmiana.data === shift.date);
                    if(existingShift) {
                        existingShift.od = shift.od;
                        existingShift.do = shift.do;
                    } else {
                        user.zmiany.push({ data: shift.date, od: shift.od, do: shift.do });
                    }
                    await user.save();
                }
            }
            res.status(200).json({ message: 'Zmiany zostały zapisane' });
        } catch (err) {
            res.status(500).json({ message: 'Błąd podczas zapisywania danych', error: err });
        }
    }

    async addUser(req, res) {
        const { login, password, imie, nazwisko, role, stanowisko, umowa, dodanyPrzez } = req.body;

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                login,
                password: hashedPassword,
                imie,
                nazwisko,
                role,
                stanowisko,
                umowa,
                dodanyPrzez
            });

            await newUser.save();
            res.status(201).json({ message: 'Pomyślnie dodano użytkownika' });
        } catch (error) {
            console.error('Błąd podczas dodawania użytkownika:', error);
            res.status(500).json({ error: 'Błąd dodawania użytkownika do bazy danych' });
        }
    }
}

module.exports = new Actions();
