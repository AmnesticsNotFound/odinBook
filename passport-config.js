const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt');


function initialize(passport, getUserByUsername, getUserById) {
    console.log("testing");
    const authenticateUser = async (username, password, done) => {
        const user = await getUserByUsername(username);
        //console.log("User searched");
        //console.log( user.password + " " + password);
        if(user == null) {
            //console.log("User: " + user);
            return done(null, false, { message:' No user with that name found' });
        }

        try {
            const result = await bcrypt.compare(password, user.password);
            if (result) {
                //console.log(await bcrypt.compare(password, user.password));
                return done(null,user);
            } else {
                //console.log("incorrect password");
                //console.log( user.password + " " + password);
                return done(null,false, { message: 'Incorrect password' });
            }
        }
        catch (e){
            return done(e);
        }
    }

    passport.use(new LocalStrategy({username: 'username'},
    authenticateUser));
    passport.serializeUser((user, done) => {
     //console.log(user.id + " first");
     done(null, user.id);
    })
    passport.deserializeUser(async (id,done) =>  {
        //console.log(id + " second");
        return done(null, await getUserById(id));
})           
}
module.exports = initialize