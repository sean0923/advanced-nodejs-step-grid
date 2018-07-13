class OriginalLibrary {
  func1() {
    console.log('I am original library func1');
  }

  func2() {
    console.log('I am original library func2');
  }
}

class CustomClass {
  static proxyStaticMethod() {
    const originalLibrary = new OriginalLibrary();
    const customClass = new CustomClass();

    return new Proxy(customClass, {
      get: function(target, property) {
        return customClass[property] || originalLibrary[property];
      },
    });
  }

  func3() {
    console.log('I am custom class func3');
  }

  func4() {
    console.log('I am custom class func3');
  }
}

const proxy = CustomClass.proxyStaticMethod();

proxy.func2();
proxy.func3();
