const User = require('../db/model');
const bcrypt = require('bcrypt');

class Actions {

    async login(req, res) {
        const { login, password } = req.body; 
        try {
            const user = await User.findOne({ login: login });
            if (!user) {
                console.log("Podany login nie istnieje");
                return res.status(401).json({ error: "Błąd podczas logowania" });
            }
            if (!user.password) {
                console.log("Użytkownik nie ma przypisanego hasła");
                return res.status(401).json({ error: "Błąd podczas logowania" });
            }
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                console.log("Zalogowano");
                const otherUsers = await User.find({
                    _id: { $ne: user._id },
                    zmiany: { $exists: true, $not: { $size: 0 } }
                }, {
                    imie: 1,
                    nazwisko: 1,
                    zmiany: 1
                })
                return res.status(200).json({ user, otherUsers });
            } else {
                console.log("Nieprawidłowe hasło");
                return res.status(401).json({ error: 'Błąd podczas logowania' });
            }
        } catch (err) {
            console.log("Błąd podczas logowania:", err);
            return res.status(500).json({ error: 'Błąd podczas logowania' });
        }
    }

    async pobierzDane(req, res) {
        try {
            const users = await User.find();
            return res.status(200).json({ users });
        } catch (err) {
            console.log("Błąd podczas pobierania listy", err);
            return res.status(500).json({error: 'Błąd podczas pobierania listy'});
        }
    }
}

module.exports = new Actions();
