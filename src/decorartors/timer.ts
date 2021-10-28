export default function timer(target: Object, methodName: string, descriptor: PropertyDescriptor) {
	const originalMethod = descriptor.value

	let clicks: number = 0;
	let start = performance.now();

	descriptor.value = function (...args: any[]) {
		let result = originalMethod.apply(this, args);

		if (clicks % 2 == 0) {
			start = performance.now();
		} else if (clicks % 2 == 1) {
			let finish = performance.now();
			let time = finish - start

			document.getElementById("time").innerText = `Move duration: ${Math.floor(time)} ms`
		}
		clicks++
		return result;
	}
}