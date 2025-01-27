const express = require('express');
const router = express.Router();
const {authenticate, isAdmin} = require('../middleware/Auth');
const User = require('../models/User');
const bcrypt = require("bcrypt");

router.get('/', authenticate, async (req, res) => {
    const { role } = req.query;
    try {
        if (req.user.role !== 'admin') {
            return res.status(200).json({ message: 'Access denied. Admins only.' });
          }
        const users = role ? await User.find({ role }) : await User.find({});
        res.json(users);
    } catch(error) {
        res.status(500).json({message: 'Failed to fetch Users', error})
    }

});
router.put('/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    const { username, email, role } = req.body;
    try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { username, email, role },
        { new: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

router.get('/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });
router.put('/authent/:id', async (req, res) => {
  const { id } = req.params;
  const {currentPassword, newPassword } = req.body;
  try {
    // Dohvati korisnika iz baze
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "Korisnik nije pronađen" });
    }

    // Provjeri trenutnu lozinku
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ error: "Trenutna lozinka nije ispravna" });
    }

    // Hashiraj novu lozinku

    // Ažuriraj lozinku
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Lozinka uspješno ažurirana" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Greška na serveru" });
  }
});
router.get('/count/members', async (req, res) => {
  try {
    const countAdmins = await User.countDocuments({role:'admin'});
    const countUsers = await User.countDocuments({role:'user'});
    res.status(200).json({countAdmins, countUsers});
  }catch(err){
    console.error(err);
    res.status(500).json({error: 'Failed to count admins and users'});
  }
});
module.exports = router;