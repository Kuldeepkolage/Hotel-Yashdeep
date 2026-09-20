import { body } from "express-validator";

export const updateContentValidator = [
  body("restaurantName").optional({ checkFalsy: true }).isString(),
  body("hero").optional().isObject(),
  body("about").optional().isObject(),
  body("contact").optional().isObject(),
  body("phone").optional({ checkFalsy: true }).isString(),
  body("email").optional({ checkFalsy: true }).isEmail().withMessage("Invalid email address"),
  body("address").optional({ checkFalsy: true }).isString(),
  body("googleMap").optional({ checkFalsy: true }).isString(),
  body("heroTitle").optional({ checkFalsy: true }).isString(),
  body("heroSubtitle").optional({ checkFalsy: true }).isString(),
  body("about").optional().isObject(),
  body("openingHours").optional(),
  body("socialLinks").optional(),
  body("seo").optional(),
  body("footer").optional(),
];
