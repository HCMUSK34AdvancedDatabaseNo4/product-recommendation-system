import { NextFunction, Request, Response, Router } from "express";
import _ from "lodash";
import { ProductRepository } from "../repositories";
import { APIRequest } from "../helpers";
import { BadRequestError } from "../helpers/error-handler";

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

  public getAllProducts = APIRequest(async (req: Request, res: Response, next: NextFunction) => {
    const products = await ProductRepository.getAllProducts();
    return { products }
  })


  public getProductById = APIRequest(async (req: Request, res: Response, next: NextFunction) => {
    const productId = req.params.productId;
    if (!productId) {
      throw new BadRequestError("Product ID is required");
    }
    const products = await ProductRepository.getProductById(productId);
    return { products }
  })

  public getProductRecommendation = APIRequest(async (req: Request, res: Response, next: NextFunction) => {
    const productId = req.params.productId;
    if (!productId) {
      throw new BadRequestError("Product ID is required");
    }
    const recommendations = await ProductRepository.getRecommendationByProductId(productId);
    return { recommendations }
  })

  public getRecommendationByUserId = APIRequest(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    if (!userId) {
      throw new BadRequestError("User ID is required");
    }
    const recommendations = await ProductRepository.getRecommendationByUserId(userId);
    return { recommendations }
  })


  public routes() {
    this.router.get("/", this.getAllProducts);
    this.router.get("/:productId", this.getProductById);
    this.router.get("/product/:productId", this.getProductRecommendation);
    this.router.get("/user/:userId", this.getRecommendationByUserId);
  }
}
