const User = require('../db/model');
const bcrypt = require('bcrypt');

class Actions {

    async login(req, res) {
        const { login, password } = req.body; 
        try {
            const user = await User.findOne({ login: login });
            if(!user) {
                console.log("Podany login nie istnieje");
                return res.status(401).json({ error: "Błąd podczas logowania" });
            }
            if(!user.password) {
                console.log("Użytkownik nie ma przypisanego hasła");
                return res.status(401).json({ error: "Błąd podczas logowania" });
            }
            const passwordMatch = await bcrypt.compare(password, user.password);
            if(passwordMatch) {
                console.log("Zalogowano");
                return res.status(200).json({ user }); 
            } else {
                console.log("Nieprawidłowe hasło");
                return res.status(401).json({ error: 'Błąd podczas logowania' });
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
            if(Hasło!== "") {
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
}

module.exports = new Actions();
