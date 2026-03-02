import type { ItemNormaService } from "./service";

class ItemNormaController {
    constructor(private readonly itemNormaService: ItemNormaService) { }
    get() {
        return this.itemNormaService.getForm()
    }
    post() {
    }

}