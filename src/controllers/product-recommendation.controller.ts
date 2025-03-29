import { NextFunction, Request, Response, Router } from "express";
import _ from "lodash";

export class ProductRecommendationController {
  public path = "/product-recommendation";

  public router: Router;
  public static instance: ProductRecommendationController;

  public static getInstance(): ProductRecommendationController {
    if (!ProductRecommendationController.instance) {
      ProductRecommendationController.instance = new ProductRecommendationController();
    }
    return ProductRecommendationController.instance;
  }

  constructor() {
    this.router = Router();
    this.routes()
  }

  public index = async (req: Request, res: Response, next: NextFunction) => {
    res.json({ message: "test" });
  }

  public routes() {
    this.router.get("/test", this.index); // for testing only
  }
}
