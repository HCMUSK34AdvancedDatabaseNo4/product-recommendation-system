import { NextFunction, Request, Response, Router } from "express";
import _ from "lodash";
import { ProductModel } from "../repositories";

export class ProductRecommendationController {
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

  public getRecommendation = async (req: Request, res: Response, next: NextFunction) => {
    const productId = req.params.productId ;
    const recommendations = await ProductModel.getRecommendationByProductId(productId);
    res.json({ recommendations });
  }


  public routes() {
    this.router.get("/test", this.index); // for testing only
    this.router.get("/:productId/recommendations", this.getRecommendation); // for testing only
  }
}
