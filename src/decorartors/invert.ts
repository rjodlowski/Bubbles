export default function invert(target: Object, methodName: string, descriptor: PropertyDescriptor) {
	const originalMethod = descriptor.value

	descriptor.value = function (...args: any[]) {
		document.body.style.filter = "invert(1)";
		let result = originalMethod.apply(this, args);
		return result;
	}
}