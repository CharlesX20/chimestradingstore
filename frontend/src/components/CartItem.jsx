import { Minus, Plus, Trash } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";

const CartItem = ({ item }) => {
	const { removeFromCart, updateQuantity } = useCartStore();

	return (
		<div className='rounded-lg border p-4 shadow-sm border-gray-700 bg-gray-800 md:p-6'>
			<div className='space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0'>
				
				{/* Product Image */}
				<div className='shrink-0 md:order-1'>
					<img
						className='h-20 md:h-32 rounded object-cover'
						src={item.image}
						alt={item.name}
					/>
				</div>

				{/* Quantity Controls + Price */}
				<div className='flex items-center justify-between md:order-3 md:justify-end'>
					<div className='flex items-center gap-2'>
						<button
							className='inline-flex h-6 w-6 items-center justify-center rounded-md border
							border-yellow-500 bg-gray-700 hover:bg-yellow-600 focus:outline-none 
							focus:ring-2 focus:ring-yellow-400'
							onClick={() => updateQuantity(item._id, item.quantity - 1)}
						>
							<Minus className='text-yellow-400' size={16} />
						</button>

						<p className='text-white font-medium'>{item.quantity}</p>

						<button
							className='inline-flex h-6 w-6 items-center justify-center rounded-md border
							border-yellow-500 bg-gray-700 hover:bg-yellow-600 focus:outline-none 
							focus:ring-2 focus:ring-yellow-400'
							onClick={() => updateQuantity(item._id, item.quantity + 1)}
						>
							<Plus className='text-yellow-400' size={16} />
						</button>
					</div>

					<div className='text-end md:order-4 md:w-32'>
						<p className='text-base font-bold text-yellow-400'>
							&#8358;{item.price.toLocaleString('en-US')}
						</p>
					</div>
				</div>

				{/* Product Details + Remove */}
				<div className='w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-lg'>
					<p className='text-base font-medium text-white hover:text-yellow-400 hover:underline'>
						{item.name}
					</p>
					<p className='text-sm text-gray-400'>{item.description}</p>

					<div className='flex items-center gap-4'>
						<button
							className='inline-flex items-center text-sm font-medium text-red-500
							 hover:text-red-400 hover:underline'
							onClick={() => removeFromCart(item._id)}
						>
							<Trash size={18} />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CartItem;
