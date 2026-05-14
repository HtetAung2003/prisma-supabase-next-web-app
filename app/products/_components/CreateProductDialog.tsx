
import CreateProductForm from "./CreateProductForm";

interface CreateProductProps {
  entityName: string;
}
const CreateProduct = ({ entityName }: CreateProductProps) => {
  return (
 
        <CreateProductForm   />
  
  );
};
export default CreateProduct;