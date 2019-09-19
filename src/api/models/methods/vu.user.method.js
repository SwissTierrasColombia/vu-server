import bcrypt from 'bcrypt';

export default (VUUserModel) => {

    // Methods
    VUUserModel.methods = {
        // Compare password
        authenticate(candidatePassword) {
            return bcrypt.compare(candidatePassword, this.password);
        }

    };

};