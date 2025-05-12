const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Por favor ingrese su nombre"],
    },
    email: {
      type: String,
      required: [true, "Por favor ingrese su correo electrónico"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Por favor ingrese un correo electrónico válido"],
    },
    // Añadimos el campo username como opcional
    username: {
      type: String,
      sparse: true, // Permite valores nulos sin violar la unicidad
      unique: true,
      lowercase: true,
      trim: true,
      default: function () {
        // Generar un username a partir del email si no se proporciona
        if (this.email) {
          return this.email.split("@")[0]
        }
        return null
      },
    },
    password: {
      type: String,
      required: [true, "Por favor ingrese una contraseña"],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    lastLogin: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
)

// Middleware para hashear la contraseña antes de guardar
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next()
  }

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Método para comparar contraseñas
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model("User", userSchema)

module.exports = User
